import type { SolarSLDProject } from '../types/solar';

export interface SavedProjectEntry {
  id: string;
  name: string;
  customerName: string;
  systemType: 'microinverter' | 'string_inverter';
  capacityKwp: number;
  updatedAt: string;
  data: SolarSLDProject;
}

const STORAGE_KEY = 'TNS_SOLAR_SAVED_PROJECTS_V1';

export function getSavedProjects(): SavedProjectEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    return [];
  } catch (e) {
    console.error('Failed to load saved projects from localStorage', e);
    return [];
  }
}

export function saveProjectToStorage(
  project: SolarSLDProject,
  customName?: string
): SavedProjectEntry {
  const projects = getSavedProjects();
  const title = customName || project.projectInfo.projectName || `โปรเจกต์ ${project.projectInfo.customerName || 'Solar'}`;
  const now = new Date().toISOString();

  const existingIndex = projects.findIndex((p) => p.id === project.id);

  const entry: SavedProjectEntry = {
    id: project.id || `proj_${Date.now()}`,
    name: title,
    customerName: project.projectInfo.customerName || 'ไม่ระบุชื่อ',
    systemType: project.inverterConfig.systemType,
    capacityKwp: project.pvConfig.totalKwp,
    updatedAt: now,
    data: {
      ...project,
      id: project.id || `proj_${Date.now()}`,
    },
  };

  if (existingIndex >= 0) {
    projects[existingIndex] = entry;
  } else {
    projects.unshift(entry);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return entry;
}

export function cloneProjectInStorage(sourceId: string): SavedProjectEntry | null {
  const projects = getSavedProjects();
  const source = projects.find((p) => p.id === sourceId);
  if (!source) return null;

  const newId = `proj_${Date.now()}_copy`;
  const copyTitle = `Copy of ${source.name}`;

  const clonedData: SolarSLDProject = JSON.parse(JSON.stringify(source.data));
  clonedData.id = newId;
  clonedData.title = copyTitle;
  clonedData.projectInfo.projectName = `Copy - ${clonedData.projectInfo.projectName}`;
  clonedData.projectInfo.drawingNo = `${clonedData.projectInfo.drawingNo}-COPY`;

  const clonedEntry: SavedProjectEntry = {
    id: newId,
    name: copyTitle,
    customerName: source.customerName,
    systemType: source.systemType,
    capacityKwp: source.capacityKwp,
    updatedAt: new Date().toISOString(),
    data: clonedData,
  };

  projects.unshift(clonedEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return clonedEntry;
}

export function deleteProjectFromStorage(id: string): void {
  const projects = getSavedProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function exportAllSavedProjectsJson(): void {
  const projects = getSavedProjects();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `TNS_Solar_All_Projects_Backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function importSavedProjectsJson(rawJson: string): number {
  try {
    const incoming = JSON.parse(rawJson);
    if (!Array.isArray(incoming)) {
      throw new Error('Invalid format: expected array of projects');
    }

    const current = getSavedProjects();
    let importedCount = 0;

    for (const item of incoming) {
      if (item.data && item.id) {
        const existingIdx = current.findIndex((c) => c.id === item.id);
        if (existingIdx >= 0) {
          current[existingIdx] = item;
        } else {
          current.push(item);
        }
        importedCount++;
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return importedCount;
  } catch (err) {
    console.error('Import error', err);
    throw err;
  }
}
