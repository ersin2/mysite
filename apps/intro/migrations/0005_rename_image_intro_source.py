# Generated by Django 4.0.6 on 2022-07-29 17:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('intro', '0004_intro_image1_intro_about_page'),
    ]

    operations = [
        migrations.RenameField(
            model_name='intro',
            old_name='image',
            new_name='source',
        ),
    ]