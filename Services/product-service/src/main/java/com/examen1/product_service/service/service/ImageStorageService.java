package com.examen1.product_service.service.service;

import com.examen1.product_service.dto.ImageUploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {

    ImageUploadResponse uploadProductImage(MultipartFile file);
}
