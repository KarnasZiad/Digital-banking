package org.sid.ebankingbackend.security.service;

import lombok.AllArgsConstructor;
import org.sid.ebankingbackend.security.entities.AppRole;
import org.sid.ebankingbackend.security.entities.AppUser;
import org.sid.ebankingbackend.security.repositories.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class AccountInitializationService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initAccounts() {
        if (appUserRepository.count() == 0) {
            // Créer un utilisateur admin par défaut
            AppUser adminUser = new AppUser();
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setEmail("admin@digitalbank.com");
            
            AppRole adminRole = new AppRole();
            adminRole.setRoleName("ADMIN");
            
            AppRole userRole = new AppRole();
            userRole.setRoleName("USER");
            
            adminUser.setRoles(List.of(adminRole, userRole));
            
            appUserRepository.save(adminUser);
        }
    }
}
