<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;

class VerifyEmailNotification extends Notification
{
    use Queueable;

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(60),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );

        return (new MailMessage)
            ->subject('✅ Verify your email - Saveurs')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Welcome to Saveurs! Please verify your email address.')
            ->action('Verify Email', $verificationUrl)
            ->line('This link will expire in 60 minutes.')
            ->line('If you did not create an account, no action is required.')
            ->salutation('Happy cooking! 🍽️');
    }
}