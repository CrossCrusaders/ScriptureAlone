# **Bible App Development**

### Prerequisites:

Software and tools you will need to have installed prior to working with the source code is listed below:

- [Python 3.9.10](https://www.python.org/downloads/release/python-3910/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Virtualenv](https://virtualenv.pypa.io/en/latest/installation.html#via-pip)

### Development Setup Instructions:

**1. Enter the `src` directory and set up a virtual enviorment if you have not already.**

```bash
cd ./src
python -m venv env
```

**2. Activate the virtual enviorment and install the dependencies.**

*Windows (cmd):*

```batch
.\env\Scripts\activate.bat
python -m pip install -r requirements.txt
```

*Linux (bash):*

```bash
source env/bin/activate
python -m pip install -r requirements.txt
```

**3. Set enviorment variables and run the flask application.**

*Windows (cmd):*

```batch
set FLASK_APP=bible
set FLASK_ENV=development
flask init-db
flask run
```

*Linux (bash):*

```bash
export FLASK_APP=bible
export FLASK_ENV=development
flask init-db
flask run
```

## Notice: If you have any questions or something you'd like to say, please do so by [submitting a new issue on the original project repository](https://github.com/ItsShawn/itsshawn.github.io/issues/new). Thank you.
