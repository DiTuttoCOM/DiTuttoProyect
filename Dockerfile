# Usa PHP con Apache
FROM php:8.2-apache

# Instala dependencias necesarias y extensiones de PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copia el frontend (HTML, CSS, JS)
COPY frontend/ /var/www/html/

# Copia el backend (PHP)
COPY backend/ /var/www/html/backend/

# Ajusta permisos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Configura Apache
RUN a2enmod rewrite
RUN echo "<Directory /var/www/html/> \n\
    Options -Indexes +FollowSymLinks \n\
    AllowOverride All \n\
    Require all granted \n\
</Directory>" > /etc/apache2/conf-available/override.conf \
    && a2enconf override

# Define el nombre del servidor (evita warnings)
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

EXPOSE 80
