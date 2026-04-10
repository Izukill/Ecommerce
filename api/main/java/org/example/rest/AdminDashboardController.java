package org.example.rest;



import org.example.rest.dto.Dashboard.DashboardAdminDTO;
import org.example.service.DashboardAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminDashboardController {

    @Autowired
    private DashboardAdminService service;



    @GetMapping("/dashboard")
    public DashboardAdminDTO dashboard() {
        return service.buscarDashboard();
    }
}