<template>
  <div class="math-tutorial">
    <div class="tutorial-header">
      <el-icon @click="$emit('close')" class="close-icon"><Close /></el-icon>
      <h2>{{ t('mathTutorial.title') }}</h2>
    </div>
    
    <el-scrollbar class="tutorial-content">
      <el-collapse v-model="activeNames">
        <!-- 基础语法 -->
        <el-collapse-item :title="t('mathTutorial.basics.title')" name="basics">
          <div class="tutorial-section">
            <p>{{ t('mathTutorial.basics.desc') }}</p>
            
            <h3>{{ t('mathTutorial.basics.inline.title') }}</h3>
            <div class="example">
              <div class="code">$E = mc^2$</div>
              <div class="result">
                <span v-html="renderMath('E = mc^2', false)"></span>
              </div>
            </div>
            
            <h3>{{ t('mathTutorial.basics.block.title') }}</h3>
            <div class="example">
              <div class="code">$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$</div>
              <div class="result">
                <div v-html="renderMath('x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}', true)"></div>
              </div>
            </div>
          </div>
        </el-collapse-item>

        <!-- 常用符号 -->
        <el-collapse-item :title="t('mathTutorial.symbols.title')" name="symbols">
          <div class="tutorial-section">
            <h3>{{ t('mathTutorial.symbols.greek.title') }}</h3>
            <el-table :data="greekSymbols" stripe>
              <el-table-column prop="name" :label="t('mathTutorial.symbols.name')" />
              <el-table-column prop="code" :label="t('mathTutorial.symbols.code')" />
              <el-table-column :label="t('mathTutorial.symbols.result')">
                <template #default="scope">
                  <span v-html="renderMath(scope.row.code, false)"></span>
                </template>
              </el-table-column>
            </el-table>

            <h3 style="margin-top: 20px;">{{ t('mathTutorial.symbols.operators.title') }}</h3>
            <el-table :data="operators" stripe>
              <el-table-column prop="name" :label="t('mathTutorial.symbols.name')" />
              <el-table-column prop="code" :label="t('mathTutorial.symbols.code')" />
              <el-table-column :label="t('mathTutorial.symbols.result')">
                <template #default="scope">
                  <span v-html="renderMath(scope.row.code, false)"></span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>

        <!-- 分数和根式 -->
        <el-collapse-item :title="t('mathTutorial.fractions.title')" name="fractions">
          <div class="tutorial-section">
            <h3>{{ t('mathTutorial.fractions.fraction.title') }}</h3>
            <div class="example">
              <div class="code">\frac{a}{b}</div>
              <div class="result">
                <span v-html="renderMath('\\frac{a}{b}', false)"></span>
              </div>
            </div>

            <div class="example">
              <div class="code">\frac{\frac{1}{x}+\frac{1}{y}}{y-z}</div>
              <div class="result">
                <span v-html="renderMath('\\frac{\\frac{1}{x}+\\frac{1}{y}}{y-z}', false)"></span>
              </div>
            </div>

            <h3>{{ t('mathTutorial.fractions.root.title') }}</h3>
            <div class="example">
              <div class="code">\sqrt{x}</div>
              <div class="result">
                <span v-html="renderMath('\\sqrt{x}', false)"></span>
              </div>
            </div>

            <div class="example">
              <div class="code">\sqrt[n]{x}</div>
              <div class="result">
                <span v-html="renderMath('\\sqrt[n]{x}', false)"></span>
              </div>
            </div>
          </div>
        </el-collapse-item>

        <!-- 上下标 -->
        <el-collapse-item :title="t('mathTutorial.scripts.title')" name="scripts">
          <div class="tutorial-section">
            <h3>{{ t('mathTutorial.scripts.superscript.title') }}</h3>
            <div class="example">
              <div class="code">x^2</div>
              <div class="result">
                <span v-html="renderMath('x^2', false)"></span>
              </div>
            </div>

            <div class="example">
              <div class="code">x^{n+1}</div>
              <div class="result">
                <span v-html="renderMath('x^{n+1}', false)"></span>
              </div>
            </div>

            <h3>{{ t('mathTutorial.scripts.subscript.title') }}</h3>
            <div class="example">
              <div class="code">x_i</div>
              <div class="result">
                <span v-html="renderMath('x_i', false)"></span>
              </div>
            </div>

            <div class="example">
              <div class="code">a_{i,j}</div>
              <div class="result">
                <span v-html="renderMath('a_{i,j}', false)"></span>
              </div>
            </div>
          </div>
        </el-collapse-item>

        <!-- 求和与积分 -->
        <el-collapse-item :title="t('mathTutorial.calculus.title')" name="calculus">
          <div class="tutorial-section">
            <h3>{{ t('mathTutorial.calculus.sum.title') }}</h3>
            <div class="example">
              <div class="code">\sum_{i=1}^{n} x_i</div>
              <div class="result">
                <div v-html="renderMath('\\sum_{i=1}^{n} x_i', true)"></div>
              </div>
            </div>

            <h3>{{ t('mathTutorial.calculus.product.title') }}</h3>
            <div class="example">
              <div class="code">\prod_{i=1}^{n} x_i</div>
              <div class="result">
                <div v-html="renderMath('\\prod_{i=1}^{n} x_i', true)"></div>
              </div>
            </div>

            <h3>{{ t('mathTutorial.calculus.integral.title') }}</h3>
            <div class="example">
              <div class="code">\int_{a}^{b} f(x) \, dx</div>
              <div class="result">
                <div v-html="renderMath('\\int_{a}^{b} f(x) \\, dx', true)"></div>
              </div>
            </div>

            <h3>{{ t('mathTutorial.calculus.limit.title') }}</h3>
            <div class="example">
              <div class="code">\lim_{x \to \infty} f(x)</div>
              <div class="result">
                <div v-html="renderMath('\\lim_{x \\to \\infty} f(x)', true)"></div>
              </div>
            </div>
          </div>
        </el-collapse-item>

        <!-- 矩阵 -->
        <el-collapse-item :title="t('mathTutorial.matrices.title')" name="matrices">
          <div class="tutorial-section">
            <h3>{{ t('mathTutorial.matrices.basic.title') }}</h3>
            <div class="example">
              <div class="code">
                \begin{matrix}<br>
                a & b \\<br>
                c & d<br>
                \end{matrix}
              </div>
              <div class="result">
                <div v-html="renderMath('\\begin{matrix} a & b \\\\ c & d \\end{matrix}', true)"></div>
              </div>
            </div>

            <h3>{{ t('mathTutorial.matrices.bracket.title') }}</h3>
            <div class="example">
              <div class="code">
                \begin{pmatrix}<br>
                1 & 2 \\<br>
                3 & 4<br>
                \end{pmatrix}
              </div>
              <div class="result">
                <div v-html="renderMath('\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}', true)"></div>
              </div>
            </div>
          </div>
        </el-collapse-item>

        <!-- 方程组 -->
        <el-collapse-item :title="t('mathTutorial.equations.title')" name="equations">
          <div class="tutorial-section">
            <h3>{{ t('mathTutorial.equations.system.title') }}</h3>
            <div class="example">
              <div class="code">
                \begin{cases}<br>
                x + y = 1 \\<br>
                x - y = 0<br>
                \end{cases}
              </div>
              <div class="result">
                <div v-html="renderMath('\\begin{cases} x + y = 1 \\\\ x - y = 0 \\end{cases}', true)"></div>
              </div>
            </div>

            <h3>{{ t('mathTutorial.equations.align.title') }}</h3>
            <div class="example">
              <div class="code">
                \begin{aligned}<br>
                f(x) &= x^2 + 2x + 1 \\<br>
                &= (x+1)^2<br>
                \end{aligned}
              </div>
              <div class="result">
                <div v-html="renderMath('\\begin{aligned} f(x) &= x^2 + 2x + 1 \\\\ &= (x+1)^2 \\end{aligned}', true)"></div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Close } from '@element-plus/icons-vue'
import katex from 'katex'
import logger from '@/utils/logger'

const { t } = useI18n()
const activeNames = ref(['basics'])

defineEmits(['close'])

const greekSymbols = [
  { name: 'Alpha', code: '\\alpha' },
  { name: 'Beta', code: '\\beta' },
  { name: 'Gamma', code: '\\gamma' },
  { name: 'Delta', code: '\\delta' },
  { name: 'Epsilon', code: '\\epsilon' },
  { name: 'Theta', code: '\\theta' },
  { name: 'Lambda', code: '\\lambda' },
  { name: 'Pi', code: '\\pi' },
  { name: 'Sigma', code: '\\sigma' },
  { name: 'Omega', code: '\\omega' }
]

const operators = [
  { name: t('mathTutorial.symbols.plus'), code: '+' },
  { name: t('mathTutorial.symbols.minus'), code: '-' },
  { name: t('mathTutorial.symbols.times'), code: '\\times' },
  { name: t('mathTutorial.symbols.div'), code: '\\div' },
  { name: t('mathTutorial.symbols.pm'), code: '\\pm' },
  { name: t('mathTutorial.symbols.leq'), code: '\\leq' },
  { name: t('mathTutorial.symbols.geq'), code: '\\geq' },
  { name: t('mathTutorial.symbols.neq'), code: '\\neq' },
  { name: t('mathTutorial.symbols.approx'), code: '\\approx' },
  { name: t('mathTutorial.symbols.infty'), code: '\\infty' }
]

function renderMath(formula, displayMode = false) {
  try {
    const html = katex.renderToString(formula, {
      displayMode,
      throwOnError: false
    })
    logger.info('Render math formula', `Formula rendered: ${formula.substring(0, 50)}`)
    return html
  } catch (error) {
    logger.error('Render math formula', `Failed to render: ${error.message}`, { formula })
    return `<span class="error">Error: ${error.message}</span>`
  }
}
</script>

<style lang="scss" scoped>
.math-tutorial {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
}

.tutorial-header {
  padding: 20px;
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  align-items: center;
  gap: 12px;
  
  h2 {
    margin: 0;
    font-size: 24px;
    color: var(--el-text-color-primary);
  }
  
  .close-icon {
    font-size: 24px;
    cursor: pointer;
    color: var(--el-text-color-regular);
    transition: color 0.3s;
    
    &:hover {
      color: var(--el-color-primary);
    }
  }
}

.tutorial-content {
  flex: 1;
  padding: 20px;
  
  :deep(.el-collapse) {
    border: none;
  }
}

.tutorial-section {
  padding: 12px 0;
  
  h3 {
    margin: 16px 0 12px;
    font-size: 16px;
    color: var(--el-text-color-primary);
  }
  
  p {
    margin: 8px 0;
    line-height: 1.6;
    color: var(--el-text-color-regular);
  }
}

.example {
  margin: 16px 0;
  padding: 16px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background-color: var(--el-fill-color-blank);
  
  .code {
    margin-bottom: 12px;
    padding: 8px 12px;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    color: var(--el-text-color-primary);
    white-space: pre-wrap;
    word-break: break-all;
  }
  
  .result {
    padding: 12px;
    text-align: center;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    :deep(.katex) {
      font-size: 1.1em;
    }
    
    :deep(.katex-display) {
      margin: 0;
    }
  }
}

:deep(.el-table) {
  margin-top: 12px;
}
</style>
