package br.com.fiap.zela;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ZelaApplication {

    static {
        System.setProperty("oracle.jdbc.timezoneAsRegion", "false");
    }

    public static void main(String[] args) {
        SpringApplication.run(ZelaApplication.class, args);
    }
}
