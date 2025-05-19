package ma.enset.digitalbanking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SpringSecurity {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Désactive CSRF (à ne faire que pour tests)
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // Autorise toutes les requêtes
        return http.build();
    }
}
