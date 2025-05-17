package ma.enset.digitalbanking.utils;

import java.time.Year;

public class AccountUtils {

    public static final String ACCOUNT_EXISTS_CODE = "001";
    public static final String ACCOUNT_NOT_EXISTS_CODE = "002";

    public static final String ACCOUNT_EXISTS_MESSAGE = "Account already exists";
    public static final String ACCOUNT_NOT_EXISTS_MESSAGE = "Account does not exist";

    public static final String ACCOUNT_CREATION_SUCCESS = "003";
    public static final String ACCOUNT_CREATION_FAILED = "004";

    public static final String ACCOUNT_CREATION_MESSAGE = " Account has been successfulley created";
    public static final String ACCOUNT_DELETION_SUCCESS = "005";

    public static final String ACCOUNT_FOUND_CODE = "006";
    public static final String ACCOUNT_NOT_FOUND_CODE = "007";
    public static final String ACCOUNT_FOUND_SUCCES = "008";
    public static final String ACCOUNT_DELETION_FAILED = "009";


    public static String generateAccountNumber() {

    Year currentYear = Year.now();

    int min = 100000;
    int max = 999999;

    // generate a random number between min and max

    int randNumber = (int) Math.floor(Math.random() * (max - min + 1)) + min;

    // convert the current and the randNumber to strings, then concatenat them

    String year = String.valueOf(currentYear.getValue());
    String randomNumber = String.valueOf(randNumber);
    StringBuilder accountNumber = new StringBuilder();

    return accountNumber.append(year).append(randomNumber).toString();

    }
}
