/**
 * ClothesRenderer.js — v4 (full softwear-style integration)
 *
 * Loads a real .glb garment model and drives it with:
 *  - VtoPoseEngine  → positions/scales/rotates the garment on the body
 *  - SMPLXBoneMapper → animates garment skeleton bones from arm/spine pose
 *
 * Works together with AREngine which calls:
 *  renderer.applyPose(poseLandmarks, camera)
 */

import * as THREE from 'three'
import { GLTFLoader }  from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { VtoPoseEngine }   from '../vto/VtoPoseEngine.js'
import { SMPLXBoneMapper } from '../vto/SMPLXBoneMapper.js'

// Set up a single shared loader with Draco support
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
dracoLoader.preload()

const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)

const GLB_MAP = [
  { keys: ['basic tee', 't-shirt', 'tshirt', 'tee', 'cotton'],        path: '/3dmodels/men/tshirts/basictee/basictee_mob.glb'            },
  { keys: ['polo'],                                                     path: '/3dmodels/men/tshirts/polotee/polotee_mob.glb'              },
  { keys: ['soccer'],                                                   path: '/3dmodels/men/tshirts/soccertee/soccertee_mob.glb'          },
  { keys: ['cardigan'],                                                 path: '/3dmodels/men/upper/nycardigantop/nycardigantop_mob.glb'    },
  { keys: ['smart shirt', 'formal shirt'],                              path: '/3dmodels/men/upper/smartshirttop/smartshirttop_mob.glb'   },
  { keys: ['shirt'],                                                    path: '/3dmodels/men/upper/smartshirttop/smartshirttop_mob.glb'   },
  { keys: ['vest', 'wool'],                                             path: '/3dmodels/men/upper/woolvesttop/woolvesttop_mob.glb'       },
  { keys: ['leather jacket'],                                           path: '/3dmodels/men/jacketsm/leatherjacket/leatherjacket_mob.glb' },
  { keys: ['puffer', 'puffa', 'parka'],                                 path: '/3dmodels/men/jacketsm/puffajacket/puffajacket_mob.glb'   },
  { keys: ['suit jacket', 'blazer', 'suit'],                            path: '/3dmodels/men/jacketsm/suitjacket/suitjacket_mob.glb'     },
  { keys: ['baseball jacket', 'varsity'],                               path: '/3dmodels/men/jacketsm/baseballjacket/baseballjacket_mob.glb' },
  { keys: ['denim jacket', 'denim'],                                    path: '/3dmodels/men/jacketsm/leatherjacket/leatherjacket_mob.glb' },
  { keys: ['jacket', 'hoodie'],                                         path: '/3dmodels/men/jacketsm/puffajacket/puffajacket_mob.glb'   },
  // Women
  { keys: ['mint jacket'],                                              path: '/3dmodels/women/jacketsf/mintjacket/mintjacket.glb'        },
  { keys: ['trench', 'coat'],                                           path: '/3dmodels/women/jacketsf/regenttrenchcoat/regenttrenchcoat.glb' },
  { keys: ['crop tee', 'crop'],                                         path: '/3dmodels/women/tops/skylinecroptee/skylinecroptee.glb'   },
  { keys: ['blouse'],                                                   path: '/3dmodels/women/tops/oxfordBlouse/oxfordBlouse.glb'        },
  { keys: ['sunflower'],                                                path: '/3dmodels/women/tops/sunflowertee/sunflowertee.glb'        },
  { keys: ['dress'],                                                    path: '/3dmodels/women/outfits/atldress/atldress.glb'             },
]

const DEFAULT_GLB = '/3dmodels/men/tshirts/basictee/basictee_mob.glb'

function resolveGlb(productName = '') {
  const lower = productName.toLowerCase()
  for (const { keys, path } of GLB_MAP) {
    if (keys.some(k => lower.includes(k))) return path
  }
  return DEFAULT_GLB
}


export class ClothesRenderer {

  constructor(scene, color = '#1a1a2e', productName = '') {
    this.scene       = scene
    this.productName = productName
    this.garment     = null      // THREE.Group — the loaded GLB scene
    this._loading    = false
    this._glbPath    = null

    this.poseEngine = new VtoPoseEngine()
    this.boneMapper = new SMPLXBoneMapper(window.innerWidth <= 768)

    this._loadGlb(resolveGlb(productName))
  }

  // ── Load GLB ──────────────────────────────────────────────────
  _loadGlb(path) {
    if (path === this._glbPath && this.garment) return
    this._glbPath = path
    this._loading = true

    if (this.garment) {
      this.scene.remove(this.garment)
      this._disposeModel(this.garment)
      this.garment = null
    }

    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene
        model.visible = false

        // Softwear keeps the garment semi-transparent so body shows through slightly
        model.traverse(o => {
          if (o.isMesh) {
            const mats = Array.isArray(o.material) ? o.material : [o.material]
            mats.forEach(m => {
              m.transparent = true
              m.opacity     = 0.94
              m.depthWrite  = false
              m.side        = THREE.DoubleSide
            })
          }
        })

        this.scene.add(model)
        this.garment = model
        this._loading = false

        // Init bone mapper after model loads
        this.boneMapper.initBones(model)
      },
      undefined,
      (err) => {
        console.warn('[ClothesRenderer] GLB load error:', err)
        this._loading = false
      }
    )
  }

  // ── Called every frame from AREngine with pose landmarks ──────
  /**
   * @param {Array}  poseLandmarks - MediaPipe Holistic poseLandmarks
   * @param {THREE.Camera} camera
   */
  applyPose(poseLandmarks, camera) {
    if (!this.garment || this._loading) {
      if (this.garment) this.garment.visible = false
      return
    }

    // 1. Position / scale / rotate garment to body using VtoPoseEngine
    this.poseEngine.update(poseLandmarks, this.garment, camera)

    // 2. Animate garment skeleton bones from arm pose
    if (this.garment.visible) {
      this.boneMapper.applyPose(this.garment, poseLandmarks, Date.now())
    }
  }

  // ── Legacy applyTransform shim (not used for clothes anymore) ─
  applyTransform(_transform) { /* no-op — use applyPose instead */ }

  setColor(_color) { /* GLB colors can't easily be swapped */ }

  setProductName(name) {
    if (name === this.productName) return
    this.productName = name
    this._loadGlb(resolveGlb(name))
  }

  setVisible(v) { if (this.garment) this.garment.visible = v }

  _disposeModel(model) {
    model.traverse(o => {
      if (o.geometry) o.geometry.dispose()
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material]
        mats.forEach(m => m.dispose())
      }
    })
  }

  dispose() {
    if (this.garment) {
      this.scene.remove(this.garment)
      this._disposeModel(this.garment)
      this.garment = null
    }
  }
}
