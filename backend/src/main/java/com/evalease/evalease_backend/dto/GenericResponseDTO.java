package com.evalease.evalease_backend.dto;

public class GenericResponseDTO<T> {
    private boolean success;
    private T data;
    private String error;

    public GenericResponseDTO() {}

    public GenericResponseDTO(boolean success, T data, String error) {
        this.success = success;
        this.data = data;
        this.error = error;
    }

    public static <T> GenericResponseDTOBuilder<T> builder() {
        return new GenericResponseDTOBuilder<>();
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public static class GenericResponseDTOBuilder<T> {
        private boolean success;
        private T data;
        private String error;

        public GenericResponseDTOBuilder<T> success(boolean success) { this.success = success; return this; }
        public GenericResponseDTOBuilder<T> data(T data) { this.data = data; return this; }
        public GenericResponseDTOBuilder<T> error(String error) { this.error = error; return this; }
        public GenericResponseDTO<T> build() { return new GenericResponseDTO<>(success, data, error); }
    }
}
