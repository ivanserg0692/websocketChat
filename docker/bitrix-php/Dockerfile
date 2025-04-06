# Use official PHP with FPM as the base image
FROM php:8.3-fpm

# Install required dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev \
    libxml2-dev libonig-dev zip unzip git \
    mariadb-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd mbstring pdo pdo_mysql mysqli xml \
    && docker-php-ext-enable gd mbstring pdo_mysql mysqli xml

# Install and enable Xdebug debugger
RUN pecl install xdebug && docker-php-ext-enable xdebug

# Install Composer for PHP dependency management
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set document root for Bitrix
WORKDIR /var/www/html

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Set up entrypoint
CMD ["php-fpm"]
