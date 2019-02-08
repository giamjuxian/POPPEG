using UnityEngine;
using EasyAR;

public class VideoImageTargetBehaviour : ImageTargetBehaviour
{
    protected override void Awake()
    {
        base.Awake();
        TargetFound += OnTargetFound;
        TargetLost += OnTargetLost;
        TargetLoad += OnTargetLoad;
        TargetUnload += OnTargetUnload;
    }

    void OnTargetFound(TargetAbstractBehaviour behaviour)
    {
        Debug.Log("Found: " + Target.Id);
    }

    void OnTargetLost(TargetAbstractBehaviour behaviour)
    {
        Debug.Log("Lost: " + Target.Id);
    }

    void OnTargetLoad(ImageTargetBaseBehaviour behaviour, ImageTrackerBaseBehaviour tracker, bool status)
    {
        Debug.Log("Load target (" + status + "): " + Target.Id + " (" + Target.Name + ") " + " -> " + tracker);
    }

    void OnTargetUnload(ImageTargetBaseBehaviour behaviour, ImageTrackerBaseBehaviour tracker, bool status)
    {
        Debug.Log("Unload target (" + status + "): " + Target.Id + " (" + Target.Name + ") " + " -> " + tracker);
    }
}