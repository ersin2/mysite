# Generated by Django 4.2.3 on 2023-08-04 10:53

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='about_us',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=250)),
                ('title2', models.CharField(max_length=250)),
                ('title3', models.CharField(max_length=250)),
                ('title4', models.CharField(max_length=250)),
                ('decription', models.TextField()),
                ('decription2', models.TextField()),
                ('decription3', models.TextField()),
                ('decription4', models.TextField()),
                ('decription5', models.TextField()),
                ('decription6', models.TextField()),
                ('decription7', models.TextField()),
                ('decription8', models.TextField()),
                ('image1', models.ImageField(upload_to='Image1/')),
                ('image2', models.ImageField(upload_to='Image2/')),
                ('image3', models.ImageField(upload_to='Image3/')),
                ('image4', models.ImageField(upload_to='Image4/')),
            ],
            options={
                'verbose_name': 'about_us',
                'verbose_name_plural': 'about_us',
            },
        ),
    ]
