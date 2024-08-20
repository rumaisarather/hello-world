# OVERVIEW
This service allows sending notifications to users via email. It uses Nodemailer to handle email sending, with a primary email service and a backup service. If the primary service fails after three attempts, emails are sent via the backup service.
