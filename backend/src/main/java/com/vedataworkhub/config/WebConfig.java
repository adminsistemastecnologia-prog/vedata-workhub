package com.vedataworkhub.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * WebConfig - Configuração de recursos estáticos do Spring MVC.
 *
 * Serve os arquivos estáticos do build do Vite (JS, CSS, imagens) a partir
 * de classpath:/static/. O padrão /assets/** é mapeado explicitamente para
 * garantir que o SpaController não intercepte essas rotas.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Servir assets do build do Vite (JS, CSS, imagens, fontes)
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/static/assets/")
                .setCachePeriod(3600);

        // Servir favicon e outros arquivos na raiz do static
        registry.addResourceHandler("/vite.svg", "/favicon.ico", "/*.png", "/*.jpg")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600);

        // Fallback geral para outros recursos estáticos
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/static/")
                .setCachePeriod(3600);
    }
}
