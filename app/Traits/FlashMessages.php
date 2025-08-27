<?php

namespace App\Traits;

use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;

trait FlashMessages
{
    /**
     * Redirect with success message
     */
    protected function success(string $message, ?string $route = null, array $parameters = []): RedirectResponse
    {
        if ($route) {
            return redirect()->route($route, $parameters)->with('success', $message);
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Redirect with error message
     */
    protected function error(string $message, ?string $route = null, array $parameters = []): RedirectResponse
    {
        if ($route) {
            return redirect()->route($route, $parameters)->with('error', $message);
        }

        return redirect()->back()->with('error', $message);
    }

    /**
     * Redirect with warning message
     */
    protected function warning(string $message, ?string $route = null, array $parameters = []): RedirectResponse
    {
        if ($route) {
            return redirect()->route($route, $parameters)->with('warning', $message);
        }

        return redirect()->back()->with('warning', $message);
    }

    /**
     * Redirect with info message
     */
    protected function info(string $message, ?string $route = null, array $parameters = []): RedirectResponse
    {
        if ($route) {
            return redirect()->route($route, $parameters)->with('info', $message);
        }

        return redirect()->back()->with('info', $message);
    }

    /**
     * Redirect with success message and return to previous page
     */
    protected function successBack(string $message): RedirectResponse
    {
        return redirect()->back()->with('success', $message);
    }

    /**
     * Redirect with error message and return to previous page
     */
    protected function errorBack(string $message): RedirectResponse
    {
        return redirect()->back()->with('error', $message);
    }

    /**
     * Handle validation errors with custom messages
     */
    protected function validationError(array $errors, string $message = 'Data yang dimasukkan tidak valid'): void
    {
        throw ValidationException::withMessages($errors);
    }

    /**
     * Handle database errors gracefully
     */
    protected function handleDatabaseError(\Exception $e, string $operation = 'operasi'): RedirectResponse
    {
        \Log::error("Database error during {$operation}: ".$e->getMessage(), [
            'exception' => $e,
            'operation' => $operation,
        ]);

        return $this->errorBack("Terjadi kesalahan saat melakukan {$operation}. Silakan coba lagi.");
    }

    /**
     * Handle file upload errors
     */
    protected function handleFileUploadError(\Exception $e, string $operation = 'upload file'): RedirectResponse
    {
        \Log::error("File upload error during {$operation}: ".$e->getMessage(), [
            'exception' => $e,
            'operation' => $operation,
        ]);

        return $this->errorBack("Terjadi kesalahan saat melakukan {$operation}. Pastikan file valid dan coba lagi.");
    }
}
