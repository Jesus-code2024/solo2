package com.tecsup.backendusuarios.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String fullUploadPath = "file:" + System.getProperty("user.dir") + "/" + uploadDir + "/";
        System.out.println("DEBUG: Configurando el handler de recursos para /uploads/** a: " + fullUploadPath); // <-- Asegúrate de que esta línea esté aquí
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(fullUploadPath);
    }
}