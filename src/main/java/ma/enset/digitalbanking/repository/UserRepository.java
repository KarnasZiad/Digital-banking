package ma.enset.digitalbanking.repository;

import ma.enset.digitalbanking.entity.user;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<user, Long> {
    boolean existsByEmail(String email);
}
