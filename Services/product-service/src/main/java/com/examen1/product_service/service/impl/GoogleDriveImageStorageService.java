package com.examen1.product_service.service.impl;

import com.examen1.product_service.dto.ImageUploadResponse;
import com.examen1.product_service.service.service.ImageStorageService;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.InputStreamContent;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.Permission;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.UserCredentials;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoogleDriveImageStorageService implements ImageStorageService {

    private static final List<String> ALLOWED_TYPES = List.of("image/jpeg", "image/png", "image/webp");

    @Value("${google.drive.enabled:false}")
    private boolean enabled;

    @Value("${google.drive.folder-id:}")
    private String folderId;

    @Value("${google.drive.credentials-path:}")
    private String credentialsPath;

    @Value("${google.drive.auth-mode:service-account}")
    private String authMode;

    @Value("${google.drive.oauth.client-id:}")
    private String oauthClientId;

    @Value("${google.drive.oauth.client-secret:}")
    private String oauthClientSecret;

    @Value("${google.drive.oauth.refresh-token:}")
    private String oauthRefreshToken;

    @Value("${google.drive.public-images:true}")
    private boolean publicImages;

    @Value("${spring.application.name:product-service}")
    private String applicationName;

    private Drive driveClient;

    @Override
    public ImageUploadResponse uploadProductImage(MultipartFile file) {
        validate(file);

        if (!enabled) {
            throw new IllegalStateException("Google Drive no esta configurado para subir imagenes.");
        }

        try {
            Drive drive = getDriveClient();
            String extension = extensionFrom(file.getOriginalFilename(), file.getContentType());
            String fileName = "product-" + UUID.randomUUID() + extension;

            com.google.api.services.drive.model.File metadata = new com.google.api.services.drive.model.File();
            metadata.setName(fileName);
            if (!folderId.isBlank()) {
                metadata.setParents(Collections.singletonList(folderId));
            }

            InputStreamContent mediaContent = new InputStreamContent(file.getContentType(), file.getInputStream());
            mediaContent.setLength(file.getSize());

            com.google.api.services.drive.model.File uploaded = drive.files()
                    .create(metadata, mediaContent)
                    .setFields("id, webViewLink, webContentLink")
                    .execute();

            if (publicImages) {
                Permission permission = new Permission()
                        .setType("anyone")
                        .setRole("reader");
                drive.permissions().create(uploaded.getId(), permission).execute();
            }

            String imageUrl = "https://drive.google.com/thumbnail?id=" + uploaded.getId() + "&sz=w1200";
            return new ImageUploadResponse(uploaded.getId(), imageUrl, uploaded.getWebViewLink());
        } catch (IOException | GeneralSecurityException ex) {
            if (ex instanceof com.google.api.client.googleapis.json.GoogleJsonResponseException googleEx
                    && googleEx.getDetails() != null
                    && "storageQuotaExceeded".equals(googleEx.getDetails().getErrors().getFirst().getReason())) {
                throw new IllegalStateException(
                        "Google Drive rechazo la subida porque las cuentas de servicio no tienen cuota. Configura OAuth con tu usuario de Google Drive.",
                        ex
                );
            }
            throw new IllegalStateException("No se pudo subir la imagen a Google Drive.", ex);
        }
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Selecciona una imagen.");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Solo se permiten imagenes JPG, PNG o WebP.");
        }
        if (file.getSize() > 8 * 1024 * 1024) {
            throw new IllegalArgumentException("La imagen no puede superar 8 MB.");
        }
    }

    private Drive getDriveClient() throws IOException, GeneralSecurityException {
        if (driveClient != null) {
            return driveClient;
        }

        GoogleCredentials credentials = loadCredentials();
        if (credentials.createScopedRequired()) {
            credentials = credentials.createScoped(Collections.singleton(DriveScopes.DRIVE_FILE));
        }

        driveClient = new Drive.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(credentials)
        )
                .setApplicationName(applicationName)
                .build();

        return driveClient;
    }

    private GoogleCredentials loadCredentials() throws IOException {
        if ("oauth".equalsIgnoreCase(authMode)) {
            if (oauthClientId.isBlank() || oauthClientSecret.isBlank() || oauthRefreshToken.isBlank()) {
                throw new IllegalStateException("Faltan credenciales OAuth de Google Drive.");
            }

            return UserCredentials.newBuilder()
                    .setClientId(oauthClientId)
                    .setClientSecret(oauthClientSecret)
                    .setRefreshToken(oauthRefreshToken)
                    .build();
        }

        if (credentialsPath != null && !credentialsPath.isBlank()) {
            try (InputStream inputStream = new FileInputStream(credentialsPath)) {
                return GoogleCredentials.fromStream(inputStream);
            }
        }

        return GoogleCredentials.getApplicationDefault();
    }

    private String extensionFrom(String originalName, String contentType) {
        if (originalName != null && originalName.lastIndexOf('.') >= 0) {
            return originalName.substring(originalName.lastIndexOf('.'));
        }
        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }
}
