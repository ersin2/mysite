# Generated by Django 4.0.6 on 2022-07-28 13:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('intro', '0003_alter_intro_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='intro',
            name='Image1',
            field=models.ImageField(default=1, upload_to='about_me', verbose_name='logo'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='intro',
            name='about_page',
            field=models.TextField(blank=True, null=True, verbose_name="Страница 'О нас'"),
        ),
    ]