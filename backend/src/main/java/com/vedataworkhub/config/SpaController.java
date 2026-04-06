package com.vedataworkhub.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * SpaController - Encaminhamento de rotas para a aplicação React (Single Page Application)
 *
 * Este controlador garante que qualquer rota de navegação SPA (sem extensão de ficheiro
 * e que não seja uma rota de API) seja entregue ao index.html do React,
 * permitindo que o React Router trate das rotas internas.
 *
 * IMPORTANTE: Os padrões de URL aqui DEVEM excluir:
 *   - /api/**  → tratado pelos RestControllers
 *   - /assets/** → ficheiros estáticos do build do Vite (JS, CSS, imagens)
 *   - /h2-console/** → console do banco H2 em desenvolvimento
 *   - Qualquer rota com extensão de ficheiro (*.js, *.css, *.png, etc.)
 *
 * A regex [^\\.] garante que apenas rotas SEM extensão de ficheiro são capturadas.
 */
@Controller
public class SpaController {

    /**
     * Encaminha a rota raiz para o index.html do React
     */
    @GetMapping("/")
    public String root() {
        return "forward:/index.html";
    }

    /**
     * Encaminha rotas SPA de primeiro nível (sem extensão de ficheiro) para o index.html.
     * Exclui: /api, /assets, /h2-console, /actuator, /admin, /static
     */
    @GetMapping("/{path:^(?!api|assets|h2-console|actuator|admin|static)[^\\.]+$}")
    public String forwardToIndex() {
        return "forward:/index.html";
    }

    /**
     * Encaminha rotas SPA aninhadas (sem extensão de ficheiro) para o index.html.
     * Exclui prefixos reservados para o backend.
     */
    @GetMapping("/{path:^(?!api|assets|h2-console|actuator|admin|static)[^\\.]+$}/**")
    public String forwardNestedToIndex() {
        return "forward:/index.html";
    }
}
