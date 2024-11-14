import type { UserConfig } from '@commitlint/types' 
import { RuleConfigSeverity } from '@commitlint/types' 

const Configuration: UserConfig = {

  extends: ['@commitlint/config-conventional'],
  parserPreset: 'conventional-changelog-conventionalcommits',
  formatter: '@commitlint/format',
  rules: {
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      [
        'feat', 'fix', 'docs', 'style', 'refactor',
        'test', 'revert', 'content', 'chore', 'build', 'ci',
        'perf', 'wip', 'release', 'merge', 'config', 'deploy',
        'security', 'dependency'
      ]
    ],
    'subject-case': [RuleConfigSeverity.Error, 'always', 'sentence-case'],
  }  
}

export default Configuration