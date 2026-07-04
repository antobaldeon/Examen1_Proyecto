package com.examen1.product_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ImageUploadResponse {

    private String fileId;
    private String imageUrl;
    private String webViewLink;
}
