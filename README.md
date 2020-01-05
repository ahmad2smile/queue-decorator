# Queue Decorator

## Install

```bash
npm i queue-decorator
```

## Usage

```typescript
@Queue<ClassWhereQueueIsUsed, InputEntityType, ReturnEntityType>(
		(a: InputEntityType, b: InputEntityType) => a.id === b.id,
	)
	async someAsyncMethod(entity: InputEntityType): Promise<ReturnEntityType> {
        // stuff
    }

```

`Queue` decorator takes a function as predicate to check condition to Queue entities.
