declare module "*.glsl" {
  const value: string;
  export default value;
}

interface MeshInfo {
  object: string;
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
  scale: THREE.Vector3;
}

interface InstanceInfo {
  object: string;
  instanceList: MeshInfo[];
  meshList: THREE.InstancedMesh[];
}
