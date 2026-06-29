FROM php:8.3-apache

RUN docker-php-ext-install pdo pdo_mysql mysqli

RUN a2enmod rewrite

COPY apache-config.conf /etc/apache2/conf-enabled/000-custom.conf
RUN a2enmod setenvif

EXPOSE 80
