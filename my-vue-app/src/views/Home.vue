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
<div class="first" style="align-items: stretch; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-top: 1rem">
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
        <text :textContent="animatedXp" id="xp-value" x="60" y="40" font-size="35" fill="#111827">0</text>
      </svg>
    </div>





    <!-- Donut Chart -->
    <div class="container">
    <svg width="200" height="200" viewBox="0 0 200 200" class="donut-chart">
      <circle
        cx="100"
        cy="100"
        r="80"
        stroke="#e5e7eb"
        stroke-width="20"
        fill="none"
      />
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
      <text
        x="100"
        y="90"
        text-anchor="middle"
        font-size="20"
        fill="#111827"

      >
        Pass {{ pass }}
      </text>
      <text
        x="100"
        y="115"
        text-anchor="middle"
        font-size="15"
        fill="#9ca3af"
      >
        Fail {{ fail }}
      </text>
    </svg>
    </div>
  </div>





  <!-- Skill Chart -->
  <div class="second" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 1rem">
    <svg viewBox="0 0 620 300" class="skill-chart">
      <template v-for="(skill, i) in data.skills" :key="i">
        <g :transform="'translate(0, ' + (i * 40) + ')'">
          <text x="0" y="20" fill="#333">
            {{ skill.type.replace('skill_', '') }}
          </text>
          <rect
  x="80"
  y="5"
  :style="{ width: skillBarWidth(skill.amount) + 'px' }"
  height="20"
  rx="4"
  ry="4"
  :fill="barColors[i % barColors.length]"
  class="skill-bar"
          />
          <text
            :x="80 + skillBarWidth(skill.amount) + 10"
            y="20"
            fill="#555"
          >
            {{ skill.amount }}
          </text>
        </g>
      </template>
    </svg>


    

        <svg class="project-chart" viewBox="-40 0 670 380">
          <!-- grid -->
          <line v-for="i in 6" :key="i" x1="0" x2="600" :y1="50 * (i-1)" :y2="50 * (i-1)" class="project-chart-grid" />
          <!-- polyline -->
          <polyline :points="projectPoints" class="project-line" />
          <!-- dots & labels -->
          <template v-for="(proj, i) in data.projects" :key="i">
            <circle :cx="projX(i)" :cy="projY(proj.amount)" r="4" />
            <text :x="projX(i)" :y="projY(proj.amount) - 10" text-anchor="middle">{{ proj.amount }}</text>
            <text
              :x="projX(i)" y="300" text-anchor="middle"
              :transform="'rotate(-45, ' + projX(i) + ', 295)'"
            >
              <title>{{ proj.object.name }}</title>
              {{ proj.object.name.length > 5 ? proj.object.name.slice(0, 5) + '…' : proj.object.name }}
            </text>
          </template>
        </svg>
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

const logout = handleLogout()

const barColors = ['#FF90BB', '#8ACCD5', '#F8F8E1']

const {
  data,
  pass, fail, dashOffset,
  animatedXp,
  skillBarWidth,
  projX, projY, projectPoints
} = useHome()

const iconBarProps = {
  xmlns: 'http://www.w3.org/2000/svg', width: 18, height: 18,
  fill: 'none', stroke: '#FF90BB', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  viewBox: '0 0 24 24', style: 'vertical-align: middle; margin-right: 6px;'
} as const

const iconClockProps = { ...iconBarProps, viewBox: '0 0 24 24' }
</script>

<style scoped src="./login.css" />
<style scoped src="./home.css" />