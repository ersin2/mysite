from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0003_alter_home_options'),
    ]

    operations = [
        # #16: fix typo 'decription' -> 'description' across all 8 fields
        migrations.RenameField(model_name='home', old_name='decription',  new_name='description'),
        migrations.RenameField(model_name='home', old_name='decription2', new_name='description2'),
        migrations.RenameField(model_name='home', old_name='decription3', new_name='description3'),
        migrations.RenameField(model_name='home', old_name='decription4', new_name='description4'),
        migrations.RenameField(model_name='home', old_name='decription5', new_name='description5'),
        migrations.RenameField(model_name='home', old_name='decription6', new_name='description6'),
        migrations.RenameField(model_name='home', old_name='decription7', new_name='description7'),
        migrations.RenameField(model_name='home', old_name='decription8', new_name='description8'),
    ]
