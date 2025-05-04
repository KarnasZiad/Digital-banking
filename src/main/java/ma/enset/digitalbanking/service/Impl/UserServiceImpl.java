package ma.enset.digitalbanking.service.Impl;

import ma.enset.digitalbanking.dto.BankResponse;
import ma.enset.digitalbanking.dto.UserRequest;
import ma.enset.digitalbanking.entity.user;

public class UserServiceImpl implements UserService {

    @Override
    public BankResponse createAccount(UserRequest userRequest) {
        user newUser = user.builder().build();


    }
}
