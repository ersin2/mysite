from django.db import models

class PortfolioProject(models.Model):
    title = models.CharField(max_length=255, verbose_name="Project Title")
    description = models.TextField(verbose_name="Description")
    tech_tags = models.CharField(max_length=255, verbose_name="Tech Stack Tags", help_text="Comma separated e.g. Python, Django, PyTorch")
    image = models.ImageField(upload_to="portfolio", verbose_name="Project Thumbnail", null=True, blank=True)
    github_url = models.URLField(max_length=500, verbose_name="GitHub URL", null=True, blank=True)
    live_url = models.URLField(max_length=500, verbose_name="Live Demo URL", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Portfolio Project"
        verbose_name_plural = "Portfolio Projects"
        ordering = ['-created_at']

