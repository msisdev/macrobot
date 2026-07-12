# macrobot

## Cookbook
```bash
# 기본 사용법 (bunx wrangler types)
bunx wrangler types

# run 폴더의 스크립트 실행 방법 (.dev.vars 환경 변수 파일을 자동으로 읽어옵니다)
# npm run cmd:* 명령어를 사용하여 실행할 수 있습니다.
# 명령인자를 전달할 때는 `--` 뒤에 입력합니다.

npm run cmd:fetch-all                 # run/fetch-all.ts 실행
npm run cmd:register -- [인자]      # run/register.ts 실행 및 인자 전달
npm run cmd:register-all              # run/register-all.ts 실행
npm run cmd:delete -- [인자]        # run/delete.ts 실행 및 인자 전달
npm run cmd:test-genai                # run/test-genai.ts 실행

# 특정 파일을 직접 지정해서 실행하고 싶을 때
npm run cmd run/fetch-all.ts
```
