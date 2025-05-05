package ma.enset.digitalbanking.utils;

import java.time.Year;

public class AccountUtils {

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
