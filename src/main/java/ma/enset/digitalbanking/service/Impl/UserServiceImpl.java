package ma.enset.digitalbanking.service.Impl;

import ma.enset.digitalbanking.dto.BankResponse;
import ma.enset.digitalbanking.dto.UserRequest;
import ma.enset.digitalbanking.entity.user;
import ma.enset.digitalbanking.utils.AccountUtils;

import java.math.BigDecimal;

public class UserServiceImpl implements UserService {

    @Override
    public BankResponse createAccount(UserRequest userRequest) {
        user newUser = user.builder()
                .firstName(userRequest.getFirstName())
                .lastName(userRequest.getLastName())
                .otherName(userRequest.getOtherName())
                .gender(userRequest.getGender())
                .address(userRequest.getAddress())
                .StateOfOrigin(userRequest.getStateOfOrigin())
                .accountNumber(AccountUtils.generateAccountNumber())
                .accountBalance(BigDecimal.ZERO)
                .email(userRequest.getEmail())
                .phone(userRequest.getPhone())
                .alternatePhone(userRequest.getAlternatePhone())
                .status("Active")


                .build();


    }
}
