# 🚚 TITO: Shift Management Dashboard

[![View Live](https://img.shields.io/badge/View%20Live-%F0%9F%9A%80-blue?style=for-the-badge)](https://facion.netlify.app/station)

**🌐 Live Demo:** [https://facion.netlify.app/station](https://facion.netlify.app/login)

**TITO (Truck In Truck Out)** is a modern, responsive surveillance and shift management platform designed for multi-plant organizations. This module provides a comprehensive interface for managing shift definitions, mapping users to specific time slots, and tracking real-time assignments based on roles and stations.

---

## 🔍 Features

* 🗖️ **Weekly Shift Scheduling**  
  Define and view shifts (Morning, Afternoon, Night) for an entire week with a user-friendly layout.

* 👨‍💼 **Role-Based Filtering**  
  Filter users dynamically by role (e.g., Guard, Operator, Supervisor) to streamline shift assignments.

* 🏭 **Station-Wise Assignment**  
  Assign users to specific stations, making management granular and efficient.

* ⛔️ **Past Date Restriction**  
  Prevent selection of dates in the past while assigning shifts.

* 👥 **Multiple Users per Shift**  
  Supports assignment of multiple users to a single shift block.

* ⚠️ **Conflict Warnings**  
  Warn if a user is double-booked or assigned overlapping shifts.

* 🔒 **Lock Used Shifts**  
  Lock shift definitions after use to prevent accidental modifications.

* 🛍️ **Mapping via Modal**  
  Clean UI where shift-user mappings are managed in modals to avoid clutter.

* 📊 **Shift Summary View**  
  Color-coded schedule table with tags, user avatars/initials, and assignment previews.

* 📱 **Mobile Responsive**  
  Works flawlessly across desktop, tablet, and mobile screens.

---

## 🗃️ Local Storage Structure

| Key           | Purpose                                            |
| ------------- | -------------------------------------------------- |
| `users`       | Stores user details with role and station mapping  |
| `shifts`      | Contains shift definitions (Morning, Afternoon...) |
| `assignments` | Maps user IDs to shifts per day and slot           |

---

## 📦 Tech Stack

| Technology       | Description                           |
| ---------------- | ------------------------------------- |
| **React + TS**   | Modern frontend framework             |
| **Tailwind CSS** | Fast, utility-first styling           |
| **LocalStorage** | Lightweight persistent state layer    |
| **React Icons**  | Beautiful icons (e.g., users, clocks) |

---

## 🖼️ Screenshots

> Add screenshots in `/public/screenshots/`

## 🤝 Collaboration: Fix → Test → PR → Review → Merge

This repo uses a simple, safe GitHub flow. Each bug/feature gets its own branch and pull request (PR). No direct pushes to main.
👉 One person opens the PR; the other person reviews & approves (you can’t approve your own PR).


## 🏷️ Conventions

* Branch names: fix/<short-bug-name>-<issue#> or feat/<short-feature>

* Commit messages: [Conventional Commits] — e.g., fix(ui): align operator chip (fixes #101)

* Always start a new branch from latest main.

















