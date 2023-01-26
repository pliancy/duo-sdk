# @pliancy/duo-sdk

## Usage

```typescript
import { Duo } from '@pliancy/Duo-sdk'

const duo = new Duo({
    apiHost: 'apihost.duo.com'
    integrationKey: '123'
    secretKey: 'abc'
})

const accounts = await duo.accounts.getAll()

const account = await duo.accounts.create('New Account')
```

## Test

```bash
yarn test
```
