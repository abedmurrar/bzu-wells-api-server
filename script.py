from __future__ import print_function
import serial
import serial.tools.list_ports
import requests
import hashlib
import os

HASH_SALT = '98wejfc0m2m23um289'
BAUDRATE = 9600


def get_port():
    ports = list(serial.tools.list_ports.comports())
    return ports[0].device


try:
    ser = serial.Serial(get_port(), BAUDRATE)
except:
    payload = {'error': 'Sink is not connected to serial'}
    r = requests.post('{}/sink'.format(os.environ['SERVER_IP']), data=payload)

while True:
    line = ser.readline()
    line = line.decode()
    line = line.strip()
    print(line)
    try:
        [id, value] = line.split('#')
        hash = hashlib.pbkdf2_hmac('sha256',
                                   line.encode(),
                                   HASH_SALT.encode(),
                                   1000,
                                   dklen=32)
        payload = {'reading': int(value), 'hash': hash}
        r = requests.post('{}/wells/{}/readings'.format(
            os.environ['SERVER_IP'], id),
                          data=payload)
    except:
        continue