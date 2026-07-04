package com.examen1.product_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fields = new LinkedHashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                fields.put(error.getField(), error.getDefaultMessage())
        );

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Datos invalidos");
        body.put("message", "Revisa los campos enviados.");
        body.put("fields", fields);

        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
        HttpStatus status = resolveStatus(ex.getMessage());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", ex.getMessage());

        return ResponseEntity.status(status).body(body);
    }

    private HttpStatus resolveStatus(String message) {
        if (message == null) {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }

        String lower = message.toLowerCase();

        if (lower.contains("not found") || lower.contains("no encontrado") || lower.contains("no encontrada")) {
            return HttpStatus.NOT_FOUND;
        }

        if (lower.contains("repetido") || lower.contains("ya existe")) {
            return HttpStatus.CONFLICT;
        }

        if (lower.contains("obligatorio") || lower.contains("invalido") || lower.contains("inválido")) {
            return HttpStatus.BAD_REQUEST;
        }

        return HttpStatus.BAD_REQUEST;
    }
}