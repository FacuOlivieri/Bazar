package com.Project.BazarV1.Exception;

public class InvalidProductException extends IllegalArgumentException{
    public InvalidProductException(String message) {
        super(message);
    }
}
