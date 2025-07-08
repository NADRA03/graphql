<template>
  <section class="main">
    <!-- ───── NAVBAR ───── -->
    <nav class="navbar">
      <div class="logo">
      <h2>RebootStats</h2>
      </div>

      <div class="user-menu">
        <div class="user-trigger">
          <h2><span>{{ data.firstName }} {{ data.lastName }}</span> ({{ data.login }})</h2>
        </div>

        <div class="user-dropdown">
          <p>{{ data.email }}</p>
        </div>
      </div>
    </nav>

    <!-- ───── CHARTS ───── -->
    <div class="charts">
      <!-- Top widget row -->
<div class="first" style="align-items: stretch; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 1rem">
    <!-- Level / Audit -->
    <div class="container" style="display: flex; flex-direction: column; gap: 0.5rem">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          stroke="#FF90BB"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
          style="position: relative; top: -2px; vertical-align: middle; margin-right: 6px"
        >
          <line x1="4" y1="20" x2="4" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="20" y1="20" x2="20" y2="14" />
        </svg>
        <h2> Level: {{ data.level ?? '—' }} </h2>
      </div>

<div>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF90BB"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    style="position: relative; top: -2px; vertical-align: middle; margin-right: 6px"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
  <h2>
    Audit Ratio: {{ data.auditRatio != null ? data.auditRatio.toFixed(1) : '—' }}
  </h2>
  <div class="warning">
  <h2 v-if="data.auditRatio != null && data.auditRatio < 0.5" >
    Be careful — your audit ratio is low!
  </h2>
  </div>
</div>
    </div>





    <!-- XP counter -->
    <div class="container">
      <svg width="220" height="60" viewBox="0 0 220 60" class="xp-counter">
        <text x="10" y="40" font-size="35" fill="#FF90BB" >XP:</text>
       <text :textContent="formatXp(animatedXp)" id="xp-value" x="60" y="40" font-size="35" fill="#111827">0</text>
      </svg>
    </div>





    <!-- Donut Chart -->
<div class="container">
  <svg width="250" height="250" viewBox="0 0 200 200" class="donut-chart">
    <defs>
      <filter id="pink-glow" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
        <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#FFC1DA" flood-opacity="0.7"/>
      </filter>
    </defs>

    <!-- Background circle with shadow -->
    <circle
      cx="100"
      cy="100"
      r="80"
      stroke="#e5e7eb"
      stroke-width="19"
      fill="none"
      filter="url(#pink-glow)"
    />
    
    <!-- Foreground progress arc -->
    <circle
      ref="arcRef"
      cx="100"
      cy="100"
      r="80"
      stroke="#8ACCD5"
      stroke-width="20"
      fill="none"
      stroke-dashoffset="0"
      stroke-linecap="round"
      class="donut-arc"
      :style="{ strokeDasharray: 502, strokeDashoffset: dashOffset }"
    />

    <!-- Labels -->
    <text
      x="100"
      y="90"
      text-anchor="middle"
      font-size="26"
      fill="#111827"
    >
      Pass {{ pass }}
    </text>
    <text
      x="100"
      y="120"
      text-anchor="middle"
      font-size="18"
      fill="#9ca3af"
    >
      Fail {{ fail }}
    </text>
  </svg>
</div>
  </div>






<div class="second" style="display: flex;  justify-content: center;
    align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-top: 1rem">

<div style="flex: 1 1 300px; max-width: 50%;">
<svg viewBox="-40 -40 450 400" class="skill-chart" style="font-family: sans-serif;">
  <defs>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
    <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#FF90BB" flood-opacity="0.7" />
  </filter>
</defs>
  <g transform="translate(160, 160)">

    <circle v-for="r in 5" :key="'circle-' + r" :r="r * 30" fill="none" stroke="#FFC1DA" />

    <g
      v-for="(skill, i) in data.skills"
      :key="'spoke-' + i"
      :transform="'rotate(' + (i * angleStep) + ')'"
    >

      <line x1="0" y1="0" x2="0" y2="-150" stroke="#FFC1DA" />

      <text
        x="0"
        y="-165"
        text-anchor="middle"
        fill="#333"
        font-size="12"
        font-family="Gochi Hand"
        dominant-baseline="middle"
        transform="rotate(0)"
        style="user-select: none;"
      >
        {{ skill.type.replace('skill_', '') }}
      </text>
    </g>

<polygon
  :points="skillPoints"
  :fill="barColors[0]"
  fill-opacity="0.4"
  :stroke="barColors[0]"
  stroke-width="2"
  filter="url(#glow)"   
/>

<circle
  v-for="(point, i) in points"
  :key="'point-' + i"
  :cx="point.x"
  :cy="point.y"
  r="5"
  :fill="barColors[i % barColors.length]"
  stroke=""
  stroke-width="2"
  filter="url(#glow)"   
/>
  </g>
</svg>
</div>



    
<div style="flex: 1 1 300px; max-width: 50%;">
        <svg class="project-chart" viewBox="-15 -140 650 500">

          
          <!-- grid -->
          <line v-for="i in 6" :key="i" x1="0" x2="600" :y1="50 * (i-1)" :y2="50 * (i-1)" class="project-chart-grid" />
          <!-- polyline -->
          <polyline :points="projectPoints" class="project-line" />
          <!-- dots & labels -->
<template v-for="(proj, i) in data.projects" :key="i">
  <circle
    :cx="projX(i)"
    :cy="projY(proj.amount)"
    r="4"
    @mouseenter="hoverIndex = i"
    @mouseleave="hoverIndex = null"
  />
  
  <text
    v-if="hoverIndex === i"
    :x="projX(i)"
    :y="projY(proj.amount) + 30"
    text-anchor="middle"
    fill="#FF90BB"
    font-size="12"
    font-family= "Gochi Hand"
    pointer-events="none"
    style="user-select:none;"
  >
    {{ proj.object.name }}
  </text>

  <text
    :x="projX(i)"
    :y="projY(proj.amount) - 10"
    text-anchor="middle"
  >
    {{ formatSize(proj.amount) }}
  </text>
</template>

          
        </svg>
        </div>
  </div>
    </div>

    <div class="logout" @click="logout" style="cursor: pointer">
    <h2>logout</h2>
    </div>
   
  </section>
</template>





<script setup lang="ts">
import { useHome } from './Home'
import { handleLogout } from './Home'
import { computed, ref, watchEffect } from 'vue'

const logout = handleLogout()
const hoverIndex = ref<number | null>(null)
const barColors = ['#8ACCD5', '#FFC1DA', '#FF90BB']

const {
  data,
  pass, fail, dashOffset,
  animatedXp,
  skillBarWidth,
  projX, projY, projectPoints
} = useHome()

// Spider chart setup
const count = computed(() => data.skills.length)
const maxRadius = 150
const angleStep = computed(() => 360 / count.value)

// Target final points
const points = computed(() =>
  data.skills.map((skill, i) => {
    const angleDeg = i * angleStep.value - 90
    const angleRad = (angleDeg * Math.PI) / 180
    const radius = (skill.amount / 100) * maxRadius
    return {
      x: Math.cos(angleRad) * radius,
      y: Math.sin(angleRad) * radius,
    }
  })
)

// Animated points
const animatedPoints = ref<Array<{ x: number; y: number }>>([])

watchEffect(() => {
  const target = points.value
  const duration = 800
  const start = performance.now()

  function animate(now: number) {
    const t = Math.min((now - start) / duration, 1)
    animatedPoints.value = target.map(p => ({
      x: p.x * t,
      y: p.y * t,
    }))
    if (t < 1) requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
})

// For polygon path
const skillPoints = computed(() =>
  animatedPoints.value.map(p => `${p.x},${p.y}`).join(' ')
)

function formatSize(amount: number): string {
  return Math.floor(amount / 1000) + ' KB'
}

function formatXp(amount: number): string {
  return Math.floor(amount / 1000) + ' KB'
}
</script>


<style scoped src="./login.css" />
<style scoped src="./home.css" />