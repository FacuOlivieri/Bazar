package com.Project.BazarV1.Exception;

public class NotEnoughStock extends RuntimeException {
    public NotEnoughStock(String message) {
        super(message);
    }
}
