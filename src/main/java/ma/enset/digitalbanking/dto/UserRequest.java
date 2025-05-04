package ma.enset.digitalbanking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class UserRequest {
    private long id;
    private String firstName;
    private String lastName;
    private String gender;
    private String email;
    private String phone;
    private String alternatePhone;
    private String address;
    private String StateOfOrigin;
    private String accountNumber;
    private BigDecimal accountBalance;
}
