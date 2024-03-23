# Generated by Django 4.0.6 on 2022-08-02 09:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='contact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('instagramm', models.URLField(max_length=255, verbose_name='instagramm')),
                ('phone', models.CharField(max_length=255, verbose_name='phone')),
                ('email', models.EmailField(max_length=200, verbose_name='email')),
            ],
        ),
    ]