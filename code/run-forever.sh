#!/bin/bash

forever start -e error.log --spinSleepTime 10000 app.js
