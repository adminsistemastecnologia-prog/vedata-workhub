package com.vedataworkhub.domain.admin.controller;

import com.vedataworkhub.domain.user.model.User;
import com.vedataworkhub.domain.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public String listUsers(@AuthenticationPrincipal User currentUser, Model model) {
        model.addAttribute("users", userService.findAll());
        model.addAttribute("user", currentUser);
        return "admin/users";
    }

    @PostMapping("/users/{id}/toggle")
    public String toggleUser(@PathVariable Long id, RedirectAttributes ra) {
        userService.toggleActive(id);
        ra.addFlashAttribute("success", "Status do usuário atualizado.");
        return "redirect:/admin/users";
    }

    @PostMapping("/users/{id}/promote")
    public String promoteUser(@PathVariable Long id, RedirectAttributes ra) {
        userService.promoteToAdmin(id);
        ra.addFlashAttribute("success", "Usuário promovido a administrador.");
        return "redirect:/admin/users";
    }
}
