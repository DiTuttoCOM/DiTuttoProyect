FROM php:8.2-apache

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Copiar tu sitio al contenedor
COPY . /var/www/html/

# Dar permisos
RUN chown -R www-data:www-data /var/www/html

# Configurar Apache para permitir .htaccess
RUN echo "<Directory /var/www/html/> \n\
    Options -Indexes +FollowSymLinks \n\
    AllowOverride All \n\
    Require all granted \n\
</Directory>" > /etc/apache2/conf-available/disable-listing.conf \
    && a2enconf disable-listing


EXPOSE 80
