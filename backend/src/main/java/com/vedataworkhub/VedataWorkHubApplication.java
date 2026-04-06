package com.vedataworkhub;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class VedataWorkHubApplication {
    private static final Logger logger = LoggerFactory.getLogger(VedataWorkHubApplication.class);

    public static void main(String[] args) {
        logger.info("========================================");
        logger.info("Iniciando Vedata WorkHub Application...");
        logger.info("========================================");
        
        SpringApplication app = new SpringApplication(VedataWorkHubApplication.class);
        Environment env = app.run(args).getEnvironment();
        
        logger.info("========================================");
        logger.info("Vedata WorkHub iniciado com sucesso!");
        logger.info("========================================");
        logger.info("Servidor rodando em: http://localhost:{}", env.getProperty("server.port"));
        logger.info("Context Path: {}", env.getProperty("server.servlet.context-path"));
        logger.info("Perfil ativo: {}", String.join(",", env.getActiveProfiles()));
        logger.info("Banco de dados: {}", env.getProperty("spring.datasource.url"));
        logger.info("========================================");
    }
}
