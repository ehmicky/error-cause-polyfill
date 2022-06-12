import {polyfill} from 'error-cause-polyfill'
import { expectType, expectError } from 'tsd'

expectType<void>(polyfill())

expectError(polyfill(true))
