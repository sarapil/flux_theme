from setuptools import setup, find_packages

with open("requirements.txt") as f:
    install_requires = f.read().strip().split("\n")

setup(
    name="flux_theme",
    version="1.0.0",
    description="Modern co-working space theme for FLUX Co-Working Space — Frappe 15",
    author="Arkan Labs",
    author_email="info@arkanlabs.com",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires
)
