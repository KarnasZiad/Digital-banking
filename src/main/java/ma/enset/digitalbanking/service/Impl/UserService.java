package ma.enset.digitalbanking.service.Impl;

import ma.enset.digitalbanking.dto.BankResponse;
import ma.enset.digitalbanking.dto.UserRequest;

public interface UserService {

    BankResponse createAccount(UserRequest userRequest);
}
