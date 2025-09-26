

import type { Character, Plot, World, Article, Project, Chapter, CustomData, CustomSection, CustomField } from '../types';

export interface SanitizationResult {
    data: {
        characters: Character[];
        plots: Plot[];
        worlds: World[];
        projects: Project[];
    };
    issuesFound: number;
}

const getEmptyState = (): SanitizationResult['data'] => ({
    characters: [],
    plots: [],
    worlds: [],
    projects: [],
});

/**
 * A hyper-robust, multi-stage sanitization and re-indexing utility.
 * It's designed to take any raw data object (from an old version, manually edited, etc.)
 * and safely reconstruct it into a valid and consistent application state,
 * fixing ID conflicts and broken relationships along the way.
 */
export const sanitizeData = (rawData: any): SanitizationResult => {
    if (!rawData || typeof rawData !== 'object') {
        return { data: getEmptyState(), issuesFound: 1 };
    }
    
    // Deep copy to prevent any modification of the original object during the process.
    const data = JSON.parse(JSON.stringify(rawData));
    let issuesFound = 0;

    // --- PHASE 1: Collect all items with an ID using a non-recursive, iterative approach ---
    const collectItemsIteratively = (root: any): any[] => {
        const itemsWithId: any[] = [];
        if (!root || typeof root !== 'object') return itemsWithId;

        const stack: any[] = [root];
        const visited = new Set(); 

        while (stack.length > 0) {
            const current = stack.pop();
            if (!current || typeof current !== 'object' || visited.has(current)) continue;
            
            visited.add(current);

            if (typeof current.id === 'number') {
                itemsWithId.push(current);
            }

            for (const value of Object.values(current)) {
                if (Array.isArray(value)) {
                    for (let i = value.length - 1; i >= 0; i--) stack.push(value[i]);
                } else if (value && typeof value === 'object') {
                    stack.push(value);
                }
            }
        }
        return itemsWithId;
    };
    const allItemsWithId = collectItemsIteratively(data);

    // --- PHASE 2: Re-index all items to guarantee ID uniqueness ---
    let maxId = 0;
    allItemsWithId.forEach(item => {
        if (item.id > maxId) maxId = item.id;
    });

    const seenIds = new Set<number>();
    const idMap = new Map<number, number>(); // Stores [oldId, newId] for remapping relationships
    let nextIdCounter = maxId + 1;

    allItemsWithId.forEach(item => {
        const originalId = item.id;
        if (typeof originalId !== 'number' || !isFinite(originalId) || seenIds.has(originalId)) {
            const newId = nextIdCounter++;
            if (typeof originalId === 'number') {
                idMap.set(originalId, newId);
            }
            item.id = newId;
            issuesFound++;
        }
        seenIds.add(item.id);
    });

    // --- PHASE 3: Update all relational IDs using an iterative approach ---
    const updateRelationshipsIteratively = (root: any, map: Map<number, number>) => {
        if (!root || typeof root !== 'object') return;

        const stack: any[] = [root];
        const visited = new Set();

        while (stack.length > 0) {
            const current = stack.pop();
            if (!current || typeof current !== 'object' || visited.has(current)) continue;
            
            visited.add(current);

            if (typeof current.worldId === 'number' && map.has(current.worldId)) {
                current.worldId = map.get(current.worldId);
                issuesFound++;
            }
            if (Array.isArray(current.relatedArticleIds)) {
                current.relatedArticleIds = current.relatedArticleIds
                    .map((id: any) => {
                        if (typeof id !== 'number') return null;
                        if (map.has(id)) {
                            issuesFound++;
                            return map.get(id);
                        }
                        return id;
                    })
                    .filter((id: any): id is number => id !== null);
            }
            
            for (const value of Object.values(current)) {
                if (Array.isArray(value)) {
                     for (let i = value.length - 1; i >= 0; i--) stack.push(value[i]);
                } else if (value && typeof value === 'object') {
                    stack.push(value);
                }
            }
        }
    };
    updateRelationshipsIteratively(data, idMap);

    // --- PHASE 4: Final sanitization pass on the now-consistent data ---
    const getSanitizedId = (item: any): number => {
        if (typeof item?.id === 'number' && isFinite(item.id)) return item.id;
        issuesFound++;
        return nextIdCounter++;
    };

    const defaultCustomData = (): CustomData => ({ title: 'Campos Personalizados', sections: [] });

    const sanitizeCustomData = (d: any): CustomData => {
        if (!d || typeof d !== 'object') return defaultCustomData();
        const sections = Array.isArray(d.sections) ? d.sections : [];

        return {
            title: typeof d.title === 'string' ? d.title : 'Campos Personalizados',
            sections: sections.filter(s => s && typeof s === 'object').map((s: any): CustomSection => ({
                id: getSanitizedId(s),
                title: typeof s.title === 'string' ? s.title : 'Nova Secção',
                fields: (Array.isArray(s.fields) ? s.fields : [])
                    .filter((f: any) => f && typeof f === 'object')
                    .map((f: any): CustomField => ({
                        id: getSanitizedId(f),
                        title: typeof f.title === 'string' ? f.title : 'Novo Campo',
                        value: typeof f.value === 'string' ? f.value : '',
                    })),
            })),
        };
    };

    const characters: Character[] = (Array.isArray(data.characters) ? data.characters : [])
        .filter((c: any) => c && typeof c === 'object')
        .map((c: any): Character => ({
            id: getSanitizedId(c),
            name: typeof c.name === 'string' ? c.name : 'Sem Nome',
            age: (typeof c.age === 'number' || typeof c.age === 'string') ? c.age : '',
            worldId: typeof c.worldId === 'number' ? c.worldId : null,
            appearance: typeof c.appearance === 'string' ? c.appearance : '',
            color: typeof c.color === 'string' ? c.color : '#4A5568',
            archetype: typeof c.archetype === 'string' ? c.archetype : '',
            personality: typeof c.personality === 'string' ? c.personality : '',
            motivation: typeof c.motivation === 'string' ? c.motivation : '',
            fear: typeof c.fear === 'string' ? c.fear : '',
            secret: typeof c.secret === 'string' ? c.secret : '',
            affiliation: typeof c.affiliation === 'string' ? c.affiliation : '',
            socialStatus: typeof c.socialStatus === 'string' ? c.socialStatus : '',
            enemiesAllies: typeof c.enemiesAllies === 'string' ? c.enemiesAllies : '',
            powers: typeof c.powers === 'string' ? c.powers : '',
            weaknesses: typeof c.weaknesses === 'string' ? c.weaknesses : '',
            equipment: typeof c.equipment === 'string' ? c.equipment : '',
            backstory: typeof c.backstory === 'string' ? c.backstory : '',
            customData: sanitizeCustomData(c.customData),
            relatedArticleIds: Array.isArray(c.relatedArticleIds) ? c.relatedArticleIds.filter((id: any): id is number => typeof id === 'number') : [],
        }));

    const plots: Plot[] = (Array.isArray(data.plots) ? data.plots : [])
        .filter((p: any) => p && typeof p === 'object')
        .map((p: any): Plot => ({
            id: getSanitizedId(p),
            title: typeof p.title === 'string' ? p.title : 'Sem Título',
            worldId: typeof p.worldId === 'number' ? p.worldId : null,
            logline: typeof p.logline === 'string' ? p.logline : '',
            act1: typeof p.act1 === 'string' ? p.act1 : '',
            act2: typeof p.act2 === 'string' ? p.act2 : '',
            act3: typeof p.act3 === 'string' ? p.act3 : '',
            threeActStructureHidden: typeof p.threeActStructureHidden === 'boolean' ? p.threeActStructureHidden : false,
            customData: sanitizeCustomData(p.customData),
            relatedArticleIds: Array.isArray(p.relatedArticleIds) ? p.relatedArticleIds.filter((id: any): id is number => typeof id === 'number') : [],
            relatedCharacterIds: Array.isArray(p.relatedCharacterIds) ? p.relatedCharacterIds.filter((id: any): id is number => typeof id === 'number') : [],
        }));
    
    const worlds: World[] = (Array.isArray(data.worlds) ? data.worlds : [])
        .filter((w: any) => w && typeof w === 'object')
        .map((w: any): World => {
            const worldId = getSanitizedId(w);
            const articles: Article[] = (Array.isArray(w.articles) ? w.articles : [])
                .filter((a: any) => a && typeof a === 'object')
                .map((a: any): Article => ({
                    id: getSanitizedId(a),
                    worldId: worldId,
                    title: typeof a.title === 'string' ? a.title : 'Sem Título',
                    category: typeof a.category === 'string' ? a.category : 'Sem Categoria',
                    content: typeof a.content === 'string' ? a.content : '',
                    color: typeof a.color === 'string' ? a.color : '#4A5568',
                    customData: sanitizeCustomData(a.customData),
                    relatedArticleIds: Array.isArray(a.relatedArticleIds) ? a.relatedArticleIds.filter((id: any): id is number => typeof id === 'number') : [],
                    relatedCharacterIds: Array.isArray(a.relatedCharacterIds) ? a.relatedCharacterIds.filter((id: any): id is number => typeof id === 'number') : [],
                }));

            return {
                id: worldId,
                name: typeof w.name === 'string' ? w.name : 'Sem Nome',
                description: typeof w.description === 'string' ? w.description : '',
                color: typeof w.color === 'string' ? w.color : '#4A5568',
                articles: articles,
                customData: sanitizeCustomData(w.customData),
            };
        });

    const projects: Project[] = (Array.isArray(data.projects) ? data.projects : [])
        .filter((p: any) => p && typeof p === 'object')
        .map((p: any): Project => ({
            id: getSanitizedId(p),
            title: typeof p.title === 'string' ? p.title : 'Sem Título',
            chapters: (Array.isArray(p.chapters) ? p.chapters : [])
                .filter((ch: any) => ch && typeof ch === 'object')
                .map((ch: any): Chapter => ({
                    id: getSanitizedId(ch),
                    title: typeof ch.title === 'string' ? ch.title : 'Novo Capítulo',
                    content: typeof ch.content === 'string' ? ch.content : '',
                })),
        }));
    
    const sanitizedResult = { characters, plots, worlds, projects };
    return { data: sanitizedResult, issuesFound };
};