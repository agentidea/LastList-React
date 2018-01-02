import axios from 'axios' // v0.15.3
import httpAdapter from 'axios/lib/adapters/http'

axios.defaults.adapter = httpAdapter // so that nock catch our test requests
